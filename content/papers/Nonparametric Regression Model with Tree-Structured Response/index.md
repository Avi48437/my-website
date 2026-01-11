---
title: Nonparametric Regression Model with Tree-structured Response
author:
  - name: Yuan Wang
  - name: J.S. Marron
  - name: Burcu Aydin
engine: knitr
date: 2026-01-10T00:00:00.000Z
math: true
katex_macros:
  \ind: \operatorname{IND}
format:
  hugo-md:
    wrap: none
    toc: false
    code-fold: true
bibliography: refs.bib
citeproc: true
link-citations: true
reference-location: document
nocite: '@*'
execute:
  echo: true
  warning: false
  message: false
---


The goal of this paper is to study the regression on tree-structured data as response with age as the input variable, which is one kind of object oriented data and the analysis of this is called the *Object Oriented Data Analysis* (OODA). Aydın et al. ([2009](#ref-Aydin2009PCA)) took OODA on trees further by studying the dependence of the **principal component scores** on **age** through a **simple linear regression analysis**. The authors of this paper has generalized the notion of the locally weighted smoother to the tree space. The approach is a particular optimization problem and an efficient algorithm with **linear time** has been proposed for a complete solution. This paper addresses the relationship of the human brain artery trees with age.

**Why Study Brain Artery Trees ?**: *"The study of brain artery trees has many target applications, including study of potential stroke victims, as well as screening for loci of pathologies such as brain tumors, see Aydın et al. ([2009](#ref-Aydin2009PCA)). In the present data set, only normal brains (determined by prescreening) are considered, and the main goal is to understand general tendencies of change in the brains of adults, over the approximate age range 20 to 70."*

Trees are non-Euclidean data even less than manifold data. That is why the authors have referred to the space of trees as **"strongly non-Euclidean"**.

### Tree Representation and Brain Artery Data

In this study, there are 98 healthy human subjects involved. Other covariates are also available, such as gender, handedness, and ethnicity, for each subject. As an early analysis on this subject they have only considered the branching structure topology of the trees: they consider the artery segments as nodes, and they consider the blood flow from one artery to another artery to be the edge direction. They have omitted the thickness of the veins, the length of the arteries, the angle and curvatures etc. geometric factors in this analysis.

The trees considered here are binary trees with roots, where one particular node is designated as the **root**, and the **level** of a node is the total number of edges along the path of the root. For example, the level of the root node is zero. Between each pair of nodes connected by an edge, the one with the higher level is the **child**, and the other is the **parent** of the child node. A node with no children is called a **leaf** node. The set of all possible rooted binary trees is called the binary tree space and is denoted by $\mathcal{T}$.

These trees are some examples of rooted binary trees. *Level-order index* has been used as described in Wang and Marron ([2007](#ref-Wang2007OODA)) to uniquely identify each node of a binary tree. In the above figure, the example trees with different level-order index sets are as follows:

$$
\ind(t_1)=\\{1,2,4\\},\quad \ind(t_2)=\\{1,2,3,4,6\\},\quad \ind(t_3)=\\{1,2,3,5,7\\},\quad\ind(t_4)=\\{1,2,3\\}
$$

For two binary trees $t_1$ and $t_2$, the Hamming metric based on their level-order index sets is defined as <span id="eq-1"></span> $$
\begin{equation}
    d_I(t_1,t_2):=\sum_{k=1}^{\infty}I\\{k\in\ind(t_1)\triangle \ind(t_2)\\},\tag{1}
\end{equation}
$$ where $I\{\cdot\}$ is the indicator and $\triangle$ is the symmetric difference between two sets. The metric is named as **integer tree metric** in Wang and Marron (2007), which counts the total number of noncommon nodes between two trees. But some situations may arise where every node may not be treated equally, and in that case the weighted tree metric is defined as

<span id="eq-2"></span> $$
\begin{equation}
    d_I^{w}(t_1,t_2):=\sum_{k=1}^{\infty}\alpha_kI\\{k\in\ind(t_1)\triangle \ind(t_2)\\};\quad \alpha_k\ge 0.\tag{2}
\end{equation}
$$

<span style="color: red;">*The data extraction and data visualization parts are not mentioned in this summary. For that, refer to Section 2.3 of the original paper.*</span>

### Methodology

Due to the non-Euclidean nature of tree space, $\mathcal{T}$, it is not straightforward to develop a simple linear regression. But at the heart of all classical Euclidean regression analysis, the fundamental concept relies on the conditional expectation. An analogous version of this has been made in the tree space in this paper. Let $T$ be a random tree from the space $(\mathcal{T},\mathcal{F},P(\theta))$, where $P(\theta)$ is a probability measure indexed by $\theta$. Frechet (1948) proposed the Frechet median, which is the minimizer of $\mathbb{E}d(X,m)$. Note that for the space $(\mathbb{R},|\cdot|)$, this leads to the usual conventional median. Similarly the authors have adopted this definition to define the Frechet median tree denoted by $\mu_F$; that is, <span id="eq-3"></span> $$
\begin{equation}
    \mu_F=\argmin_{m\in \mathcal{T}}\mathbb{E}d_I(T,m)\tag{3}
\end{equation}
$$

and, correspondingly, the Frechet Variation about the center is quantified by <span id="eq-4"></span> $$
\begin{equation}
    V_F=\mathbb{E}d_I(T,\mu_F)\tag{4}
\end{equation}
$$

Following these definitions, the sample version of the tree median and the variation are defined as

<span id="eq-5"></span> $$
    \hat{\mu}\_F=\argmin_{m\in \mathcal{T}}\frac{1}{n}\sum_{i=1}^nd_I(t_i,m);\quad
    \hat{V}\_F=\frac{1}{n}\sum_{i=1}^nd_I(t_i,\hat{\mu}\_F)\tag{5}
$$

where $t_1,\dots,t_n\sim P(\theta)$. Wang and Marron ([2007](#ref-Wang2007OODA)) proposed an algorithm, *the majority rule* to address the median tree and suggested to take that tree which appears more than n/2 times in the tree sample and some or all nodes that appear exactly $n/2$ times (*Note that it is not necessary that the median tree appears in the sample you have drawn*).

## References

Aydın, B., G. Pataki, H. Wang, E. Bullitt, and J. S. Marron. 2009. "A Principal Component Analysis for Trees." *The Annals of Applied Statistics* 3 (4): 1597--1615. <https://doi.org/10.1214/09-AOAS241>.

Wang, H., and J. S. Marron. 2007. "Object Oriented Data Analysis: Sets of Trees." *The Annals of Statistics* 35 (5): 1849--73. <https://doi.org/10.1214/009053607000000532>.
